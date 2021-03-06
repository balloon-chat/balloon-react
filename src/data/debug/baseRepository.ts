import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class InMemoryBaseRepository<K, V> {
  private data = new Map<K, V>();
  private behaviorSubject = new BehaviorSubject<Map<K, V>>(this.data);

  save(key: K, value: V): Promise<void> {
    this.data.set(key, value);
    this.behaviorSubject.next(this.data);
    return Promise.resolve();
  }

  find(key: K): Promise<V | undefined> {
    return Promise.resolve(this.data.get(key));
  }

  findAll(): Promise<V[]> {
    return Promise.resolve(Array.from(this.data.values()));
  }

  observe(key: K): Observable<V | undefined> {
    return this.behaviorSubject
        .pipe(map(data => data.get(key)));
  }

  observeAll(): Observable<V[]> {
    return this.behaviorSubject
        .pipe(map(data => Array.from(data.values())));
  }

  delete(key: K) : Promise<void> {
    this.data.delete(key);
    this.behaviorSubject.next(this.data);
    return  Promise.resolve();
  }
}
