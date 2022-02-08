const isFunction = (fn: any) => typeof fn === 'function';

export interface SubscriptionLike {
  unsubscribe(): void;
}

export class SubSink {

  protected _subs: SubscriptionLike[] = [];

  constructor() {}

  add(...subscriptions: SubscriptionLike[]) {
    this._subs = this._subs.concat(subscriptions);
  }

  set sink(subscription: SubscriptionLike) {
    this._subs.push(subscription);
  }

  unsubscribe() {
    this._subs.forEach(sub => sub && isFunction(sub.unsubscribe) && sub.unsubscribe());
    this._subs = [];
  }
}
