import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { BaseComponent } from './base/base.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './login-panel/sign-up/sign-up.component';
import { LogInComponent } from './login-panel/log-in/log-in.component';
import { TasksComponent } from './base/tasks/tasks.component';
import { ScheduleComponent } from './base/schedule/schedule.component';
import { AnnouncementsComponent } from './base/announcements/announcements.component';
import { TeachersComponent } from './base/teachers/teachers.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './base/profile/profile.component';
import {MatListModule} from "@angular/material/list";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import {MatDialogModule} from '@angular/material/dialog';
import {DialogChangePasswordComponent} from "./base/profile/dialog-change-password";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DialogChangeLesson} from "./base/schedule/dialog-change";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import { StudentsComponent } from './base/students/students.component';
import { ConfirmDialogComponent } from './base/profile/confirm-dialog.component';
import {NotFoundComponent} from "./base/not-found/not-found.component";
import {MatTooltipModule} from "@angular/material/tooltip";

registerLocaleData(localeRu, 'ru');
@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		BaseComponent,
		SignUpComponent,
		LogInComponent,
		ScheduleComponent,
		AnnouncementsComponent,
		TeachersComponent,
		ProfileComponent,
        DialogChangePasswordComponent,
        DialogChangeLesson,
        StudentsComponent,
        ConfirmDialogComponent,
        NotFoundComponent,
	],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatMenuModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TasksComponent,
        MatButtonToggleModule,
        MatListModule,
        MatSnackBarModule,
        MatSelectModule,
        MatTableModule,
        MatDialogModule,
        MatButtonModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatTooltipModule,
    ],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
