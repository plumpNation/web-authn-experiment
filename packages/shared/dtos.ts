export type UserDto = {
    id: string;
    name: string;
    certificate?: string;
};

export type ChallengeDto = {
    user: UserDto;
    challenge: string;
};