// Decorators
function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
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

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInpEl.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private appendHtml() {
    this.hostEl.insertAdjacentElement('afterbegin', this.element);
  }
}

const prtInp = new ProjectInput();
