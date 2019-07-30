export class FSM {
  private currentState: string;

  constructor(states: string[]) {
    this.currentState = states[0];
  }

  public getCurrentState(): string {
    return this.currentState;
  }
}
