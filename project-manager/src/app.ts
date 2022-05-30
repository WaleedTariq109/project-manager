//* Interface
/**
 * @interface Validatable
 */
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

//* Validator Function
/**
 * @param validateAbleObj Required and must satisfy Validatable Interface
 */
function validator(validateAbleObj: Validatable) {
  let isValid = true;
  if (validateAbleObj.required) {
    isValid = isValid && validateAbleObj.value.toString().trim().length !== 0;
  }
  if (validateAbleObj.minLength != null && typeof validateAbleObj.value === 'string') {
    isValid = isValid && validateAbleObj.value.length >= validateAbleObj.minLength;
  }
  if (validateAbleObj.maxLength != null && typeof validateAbleObj.value === 'string') {
    isValid = isValid && validateAbleObj.value.length <= validateAbleObj.maxLength;
  }
  if (validateAbleObj.min != null && typeof validateAbleObj.value === 'number') {
    isValid = isValid && validateAbleObj.value >= validateAbleObj.min;
  }
  if (validateAbleObj.max != null && typeof validateAbleObj.value === 'number') {
    isValid = isValid && validateAbleObj.value <= validateAbleObj.max;
  }

  return isValid;
}

//* Decorators
/**
 * @param _ Required but never used
 * @param __ Required but never used
 * @param descriptor Required and must be a PropertyDescriptor
 * @returns Always return PropertyDescriptor
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

//? Class Definations

//* Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus
  ) {}
}

// Custom Type
type Listner = (items: Project[]) => void;

//* Project State management Class
class ProjectState {
  private listners: Listner[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstance(): ProjectState {
    if (this.instance) {
      return this.instance;
    }
    return (this.instance = new ProjectState());
  }

  /**
   * @param listnersFn Required and receives Listner Function
   */
  addListners(listnersFn: Listner): void {
    this.listners.push(listnersFn);
  }

  /**
   * @param title Required and must be a string
   * @param description Required must be a string
   * @param numOfPeoples Required must be a number
   */
  addProject(title: string, description: string, numOfPeoples: number): void {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeoples, ProjectStatus.Active);
    this.projects.push(newProject);
    for (const listnersFn of this.listners) {
      listnersFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

//* Project List Class
class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  assignedProject: Project[];

  /**
   * @param type Required and must be string 'active' | 'finished'
   */
  constructor(private type: 'active' | 'finished') {
    this.templateEl = <HTMLTemplateElement>document.querySelector('#project-list');
    this.hostEl = <HTMLDivElement>document.querySelector('#app');
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${this.type}-projects`;
    this.assignedProject = [];

    projectState.addListners((projects: Project[]) => {
      this.assignedProject = projects;
      this.renderProjects();
    });

    this.appendHtml();
    this.renderContent();
  }

  /**
   * @private Returns Nothing just render projects on DOM
   */

  private renderProjects(): void {
    const listEl = <HTMLUListElement>document.querySelector(`#${this.type}-project-list`)!;
    for (const prjItem of this.assignedProject) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  /**
   * @private Returns Nothing just render content on DOM
   */

  private renderContent(): void {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  /**
   * @private Returns Nothing just Append the HTML code on DOM
   */

  private appendHtml(): void {
    this.hostEl.insertAdjacentElement('beforeend', this.element);
  }
}

//* Project Input Class
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
   * @returns Nothing or Tuple
   */
  private fetchUserInputs(): [string, string, number] | void {
    const enteredTitle = this.titleInpEl.value;
    const enteredDescription = this.descriptionInpEl.value;
    const enteredPeople = this.peopleInpEl.value;

    const validateTitle: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const validateDescription: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const validatePeople: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (!validator(validateTitle) || !validator(validateDescription) || !validator(validatePeople)) {
      alert('Invalid input! Please try again');
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput(): void {
    this.titleInpEl.value = this.descriptionInpEl.value = this.peopleInpEl.value = '';
  }

  /**
   * @param event Required and must be an Event Object
   */
  @AutoBind
  private submitHandler(event: Event): void {
    event.preventDefault();
    const userInputs = this.fetchUserInputs();
    if (Array.isArray(userInputs)) {
      const [title, description, people] = userInputs;
      projectState.addProject(title, description, people);
    }

    this.clearInput();
  }

  private configure(): void {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private appendHtml(): void {
    this.hostEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const prtInp = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');
