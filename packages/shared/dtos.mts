import { ES256 } from "./attestation-object.types.mts";

export type UserDto = {
  id: string;
  name: string;
  certificate?: string;
};

export type ChallengeDto = {
  user: UserDto;
  challenge: string;
};

export type PostRegistrationDto = {
  username: string;
};

export type PostAuthenticationDto = PostRegistrationDto;

export type PostVerifyRegistrationDto = {
  username: string;
  attestationObject: string;
  clientDataJSON: string;
};

export type PublicKeyRegistrationDto = {
  challenge: string;
  rp: {
    name: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: { type: "public-key", alg: ES256 }[]
};

export type PostVerifyAuthenticationDto = {
  username: string;
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
};

export type AuthenticationDto = {
  challenge: string;
  allowCredentials: {
    type: "public-key";
    id: string;
  }[]
}