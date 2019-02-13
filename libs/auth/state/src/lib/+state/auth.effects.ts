import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { AuthPartialState } from './auth.reducer';
import {
  Login,
  LoginSuccess,
  LoginFailure,
  LoginRedirect,
  Logout,
  LogoutConfirmation,
  LogoutDismiss,
  AuthActionTypes
} from './auth.actions';
import { AuthUserVW } from '@recipe-app-ngrx/models';
import { LocalStorageService } from '@recipe-app-ngrx/utils';
import { AuthService } from '../services/auth.service';
import { LogoutConfirmationDialogComponent } from '@recipe-app-ngrx/auth/login-ui';
import { Router } from '@angular/router';
import { RouterHistoryFacade } from '@recipe-app-ngrx/router-history-state';

@Injectable()
export class AuthEffects {

  @Effect()
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.Login),
    map(action => action.payload.authUser),
    exhaustMap((auth: AuthUserVW) =>
      this.authService.login(auth).pipe(
        tap(user => {
          if (user && user.token) {
            this.localeStorageService.setItem('currentUser', JSON.stringify(user));
          }
        }),
        map(user => new LoginSuccess({ user })),
        catchError(error => of(new LoginFailure({ error: error.error })))
      )
    )
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    exhaustMap(() => {
      const dialogRef = this.dialog.open<
        LogoutConfirmationDialogComponent,
        undefined,
        boolean
      >(LogoutConfirmationDialogComponent);

      return dialogRef.afterClosed();
    }),
    map(
      result =>
        result
          ? new LogoutConfirmation()
          : new LogoutDismiss()
    )
  );

  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    // -- maybe should load additional data for authenticated users
    withLatestFrom(this.routerHistoryFacade.previousRouter$),
    tap(([action, router]) => this.router.navigate([router.url]))
  );

  constructor(
    private actions$: Actions,
    private dataPersistence: DataPersistence<AuthPartialState>,
    private authService: AuthService,
    private localeStorageService: LocalStorageService,
    private dialog: MatDialog,
    private router: Router,
    private routerHistoryFacade: RouterHistoryFacade
  ) {}
}
