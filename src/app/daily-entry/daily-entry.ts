import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  FormControl,
  Validators, // Import Validators
} from '@angular/forms';

@Component({
  selector: 'app-daily-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-entry.html',
  styleUrls: ['./daily-entry.css'],
})
export class DailyEntry implements OnInit {
  date: Date = new Date();
  dailyEntryForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.dailyEntryForm = this.fb.group({
      notes: this.fb.array([]),
    });
  }

  ngOnInit() {
    // Add the first note field when the component loads
    this.addNote();
  }

  // Getter for easy access to the notes FormArray in the template
  get notes(): FormArray {
    return this.dailyEntryForm.get('notes') as FormArray;
  }

  // Adds a new, empty note control to the FormArray with validation
  addNote() {
    this.notes.push(new FormControl('', Validators.required));
  }

  // Removes a note control from the FormArray at a given index
  removeNote(index: number) {
    // Prevent removing the last note field
    if (this.notes.length > 1) {
      this.notes.removeAt(index);
    }
  }

  onSubmit() {
    // Clear previous messages
    this.successMessage = '';
    this.errorMessage = '';

    // Mark all fields as touched to show validation errors
    this.dailyEntryForm.markAllAsTouched();

    // Check if the form is valid
    if (this.dailyEntryForm.valid) {
      // The form value will contain an array of notes
      console.log(this.dailyEntryForm.value.notes);

      // Set a success message
      this.successMessage = 'Your notes have been submitted successfully!';

      // Reset the form: clear all notes and add a fresh one
      this.notes.clear();
      this.addNote();

      // Optional: Clear the message after a few seconds
      setTimeout(() => (this.successMessage = ''), 3000);
    } else {
      // If the form is invalid, set an error message
      this.errorMessage = 'Please fill out all note fields before submitting.';

      // Optional: Clear the message after a few seconds
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }
}
