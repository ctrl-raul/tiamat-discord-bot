export default class UsesHistory {

  private history: Record<string, number[]> = {};
  public entryLifetimeSeconds: number;

  constructor (entryLifetimeSeconds: number) {
    this.entryLifetimeSeconds = entryLifetimeSeconds;
  }

  add (key: string, timestamp: number) {
    if (this.history[key]) {
      this.history[key].push(timestamp);
    } else {
      this.history[key] = [timestamp];
    }
  }

  getCount (key: string): number {

    const history = this.history[key];

    if (typeof history === 'undefined') return 0;

    const now = Date.now();
    const cleanedHistory = history.filter(time =>
      now - time < this.entryLifetimeSeconds * 1000
    );

    this.history[key] = cleanedHistory;

    return cleanedHistory.length;
  }

}