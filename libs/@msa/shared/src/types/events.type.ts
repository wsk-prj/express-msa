export interface UserSignupEvent {
  userId: number;
}

export interface EventTypes {
  "user.signup": UserSignupEvent;
}

export type EventType = keyof EventTypes;
