import { inject } from 'aurelia-framework'
import { IssueService } from './services/issues'

@inject(IssueService)
export class Welcome {
  heading = 'Welcome to the Aurelia Navigation App!';
  firstName = 'John';
  lastName = 'Doe';
  previousValue = this.fullName;

  constructor(issueService) {
    this.issueService = issueService
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  submit() {
    this.issueService.findAll().then(issues => {
      this.issues = issues
      console.log(this.issues)
      this.previousValue = this.fullName;
      alert(`Welcome, ${this.fullName}!`);
    })
  }

  canDeactivate() {
    if (this.fullName !== this.previousValue) {
      return confirm('Are you sure you want to leave?');
    }
  }
}

export class UpperValueConverter {
  toView(value) {
    return value && value.toUpperCase();
  }
}