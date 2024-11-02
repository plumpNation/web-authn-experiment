import cbor from 'cbor';
import crypto from 'crypto';
import type { AttestationObject, ClientData } from 'shared/attestation-object.types.mts';
import { PostVerifyRegistrationDto } from 'shared/dtos.mjs';

/**
 * Encapsulates the attestation validation, and verification.
 */
export class Attestation {
  rawAttestationObject: string;
  attestationObject: AttestationObject;
  clientDataJSON: string;
  clientData: ClientData;
  username: string;

  constructor(
    {
      username,
      attestationObject,
      clientDataJSON
    }: PostVerifyRegistrationDto,
    expectations: {
      challenge: string,
      fmt: string,
      rpid: string,
      origin: string,
    }
  ) {
    this.rawAttestationObject = attestationObject;
    this.clientDataJSON = clientDataJSON;
    this.username = username;

    this.attestationObject = cbor.decode(Buffer.from(attestationObject, 'base64'));
    this.clientData = JSON.parse(Buffer.from(clientDataJSON, 'base64').toString('utf8'));

    this.validateFmt(expectations.fmt);
    this.validateRPID(expectations.rpid);
    this.validateChallenge(expectations.challenge);
    this.validateOrigin(expectations.origin);
    this.validateType('webauthn.create')

    if (!this.flags.userPresent) {
      throw new Error('User not present');
    }
  }

  private get fmt() {
    return this.attestationObject.fmt;
  }

  private get authData() {
    return this.attestationObject.authData;
  }

  private get attStmt() {
    return this.attestationObject.attStmt;
  }

  private validateChallenge(expectedChallenge: string) {
    if (this.clientData.challenge !== expectedChallenge) {
      throw new Error('Unexpected challenge');
    }
  }

  private validateOrigin(expectedOrigin: string) {
    if (this.clientData.origin !== expectedOrigin) {
      throw new Error('Unexpected origin');
    }
  }

  private validateType(expectedType: string) {
    if (this.clientData.type !== expectedType) {
      throw new Error(`Unexpected type: ${this.clientData.type}`);
    }
  }

  private validateFmt(expectedFmt: string) {
    if (this.fmt !== expectedFmt) {
      throw new Error(`Unexpected attestation format: ${this.fmt}`);
    }
  }

  private validateRPID(expectedRPID: string) {
    // The relying party ID hash is the first 32 bytes of the authData.
    // This is generally the domain of the server.
    // This ID ensures that credentials are scoped to a particular domain,
    // enhancing security by preventing cross-domain use of credentials.
    const expectedRPIDHash = crypto.createHash('sha256').update(expectedRPID).digest();

    if (!this.rpIdHash.equals(expectedRPIDHash)) {
      throw new Error(`Unexpected RP ID: ${this.rpIdHash}`);
    }
  }

  private get flags () {
    return {
      userPresent: (this.authData[32] & 0x01) !== 0,
      userVerified: (this.authData[32] & 0x04) !== 0,
    }
  }

  private get rpIdHash() {
    return this.authData.subarray(0, 32);
  }

  private get credential() {
    const data = this.authData.subarray(37);

    return {
        aaguid: data.subarray(0, 16),
        credentialIDLength: data.readUInt16BE(16),
        credentialID: data.subarray(18, 18 + data.readUInt16BE(16)),
        credentialPublicKey: data.subarray(18 + data.readUInt16BE(16)),
    }
  }

  isVerified() {
    const clientDataHash = crypto
      .createHash('sha256')
      .update(Buffer.from(this.clientDataJSON, 'base64'))
      .digest();

    const verificationData = Buffer.concat([
      Buffer.from(this.authData),
      clientDataHash,
    ]);

    return crypto
      .createVerify('SHA256')
      .update(verificationData)
      .verify(this.credential.credentialPublicKey, this.attStmt.sig);
  }
}
