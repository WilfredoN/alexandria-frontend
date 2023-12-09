import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from "../../service/auth-service";
import {loginDTO} from "../../service/login-dto";

export interface DialogData {
    user: loginDTO;
    oldPassword: string;
    newPassword: string;
    newPassword_confirm: string;
}

@Component({
    selector: 'dialog-change-password',
    templateUrl: 'dialog-change-password.html',
})
export class DialogChangePasswordComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogChangePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _snackBar: MatSnackBar,
        private authService: AuthService,
    ) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    changePasswordDialog() {
        const {newPassword, newPassword_confirm, oldPassword, user} = this.data;

        if (newPassword === newPassword_confirm && newPassword.length >= 6 && newPassword !== oldPassword) {
            this.authService.update(user, newPassword).subscribe({
                next: () => this.handlePasswordUpdate(newPassword),
                error: (error) => this.handleError(error),
            });
        } else {
            this._snackBar.open('Пароль не изменен', 'Закрыть', {duration: 3000});
        }
    }

    private handlePasswordUpdate(newPassword: string) {
        const {user} = this.data;
        user.password = newPassword;
        user.role = localStorage.getItem('role') as string;
        localStorage.setItem('user', JSON.stringify(user));

        this._snackBar.open('Пароль успешно изменен', 'Закрыть', {duration: 3000});
        this.dialogRef.close();
    }

    private handleError(error: any) {
        console.error('Ошибка при изменении пароля', error);
        this._snackBar.open('Пароль не изменен', 'Закрыть', {duration: 3000});
    }

}
