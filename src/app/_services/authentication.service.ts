import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(environment.apiUrl + '/api/core/login', { username, password }, {observe: 'response'})
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                const token = response.headers.get('Lemon-Authorization');
                if (response.status === 200 && token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('authHeader', 'Bearer ' + token);
                    this.currentUserSubject.next(response.body.user);
                }

                return response.body.user;
            }));
    }

    socialLogin(token: string) {
        const httpHeaders = new HttpHeaders()
                         .set('Accept', 'application/json')
                         .set('Authorization', `Bearer ${token}`);
        return this.http.get<any>(environment.apiUrl + '/api/core/context', {
            headers: httpHeaders,
            observe: 'response'
        }).pipe(map(response => {
                // login successful if there's a jwt token in the response
                token = response.headers.get('Lemon-Authorization');
                if (response.status === 200 && token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('authHeader', 'Bearer ' + token);
                    this.currentUserSubject.next(response.body.user);
                }

                return response.body.user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
