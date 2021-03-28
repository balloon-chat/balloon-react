import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class FakeBaseRepository<K, V> {
  private data = new Map<K, V>();

  private behaviorSubject = new BehaviorSubject<Map<K, V>>(this.data);

  save(key: K, value: V) {
    this.data.set(key, value);
    this.behaviorSubject.next(this.data);
  }

  find(key: K): V | undefined {
    return this.data.get(key);
  }

  findAll(): V[] {
    return Array.from(this.data.values());
  }

  observe(key: K): Observable<V | undefined> {
    return this.behaviorSubject
      .pipe(map((data) => data.get(key)));
  }

  observeAll(): Observable<V[]> {
    return this.behaviorSubject
      .pipe(map((data) => Array.from(data.values())));
  }

  delete(key: K) {
    this.data.delete(key);
    this.behaviorSubject.next(this.data);
  }

  clean() {
    this.data.clear();
    this.behaviorSubject.next(this.data);
  }
}
