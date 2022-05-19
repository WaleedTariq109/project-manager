// Interface
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// Validator Function
/**
 * @param validateAbleObj
 */
function validator(validateAbleObj: Validatable) {
  let isValid = true;
  if (validateAbleObj.required) {
    isValid = isValid && validateAbleObj.value.toString().trim().length !== 0;
  }
}

// Decorators
/**
 * @param _
 * @param __
 * @param descriptor
 * @returns
 */
function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFN = originalMethod.bind(this);
      return boundFN;
    },
  };
  return adjDescriptor;
}

// Class Defination
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInpEl: HTMLInputElement;
  descriptionInpEl: HTMLInputElement;
  peopleInpEl: HTMLInputElement;

  constructor() {
    this.templateEl = <HTMLTemplateElement>document.querySelector('#project-input');
    this.hostEl = <HTMLDivElement>document.querySelector('#app');
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = 'user-input';
    this.titleInpEl = <HTMLInputElement>this.element.querySelector('#title');
    this.descriptionInpEl = <HTMLInputElement>this.element.querySelector('#description');
    this.peopleInpEl = <HTMLInputElement>this.element.querySelector('#people');

    this.configure();
    this.appendHtml();
  }

  /**
   * @returns
   */
  private fetchUserInputs(): [string, string, number] | void {
    const enteredTitle = this.titleInpEl.value;
    const enteredDescription = this.descriptionInpEl.value;
    const enteredPeople = this.peopleInpEl.value;

    if (
      enteredTitle.trim().length === 0 ||
      enteredDescription.trim().length === 0 ||
      enteredPeople.trim().length === 0
    ) {
      alert('Invalid input! Please try again');
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput() {
    this.titleInpEl.value = this.descriptionInpEl.value = this.peopleInpEl.value = '';
  }

  /**
   * @param event
   */
  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputs = this.fetchUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      console.log(title);
      console.log(description);
      console.log(people);
    }

    this.clearInput();
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private appendHtml() {
    this.hostEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const prtInp = new ProjectInput();
