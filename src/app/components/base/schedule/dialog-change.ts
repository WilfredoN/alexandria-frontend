import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
    selector: 'dialog-change-lesson',
    templateUrl: './schedule-change-dialog.html',
})
export class DialogChangeLesson {
    constructor(public dialogRef: MatDialogRef<DialogChangeLesson>,
                @Inject(MAT_DIALOG_DATA) public data: {message: string}) {
    }

    onConfirmClick(): void {
        this.dialogRef.close('confirm');
    }

    onCancelClick(): void {
        this.dialogRef.close('cancel');
    }
}
