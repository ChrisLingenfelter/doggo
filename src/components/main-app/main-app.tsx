import { Component, Element, h, State } from '@stencil/core';

@Component({
  tag: 'main-app',
  styleUrl: 'main-app.css',
  shadow: true,
})
export class MainApp {

  selectedBreed: string;

  @Element() element: HTMLElement;
  @State() breeds: string[];
  @State() imgSrc: string;

  componentWillLoad() {
    this.getBreedList();
    this.getRandomDogPhoto();
  }

  handleRandomButtonClick = () => {
    this.getRandomDogPhoto();
  }

  handleBreedGoButtonClick = () => {
    this.getPhotoByBreed();
  }

  getRandomDogPhoto() {
    try {
      fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => response.json())
        .then(data => this.imgSrc = data.message);
    } catch(e) {
      console.log(e);
    }
  }

  getPhotoByBreed() {
    if (!this.selectedBreed) this.selectedBreed = this.breeds[0];

    try {
      fetch(`https://dog.ceo/api/breed/${this.selectedBreed}/images`)
      .then(response => response.json())
      .then(data => this.imgSrc = data.message[Math.floor(Math.random() * data.message.length)]);
    } catch(e) {
      console.log(e);
    }
  }

  async getBreedList() {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const data = await response.json();
      let breedsList: string[] = new Array();

      for (let breed in data.message) {
          breedsList.push(breed);
        }

      this.breeds = breedsList;
    } catch(e) {
      console.log(e);
    }
  }

  breedSelectionHandler = (event: Event) => {
    this.selectedBreed = (event.target as HTMLInputElement).value;
  }

  render() {
    return (
      <div>
        <a>Doggo</a>
        <img src={this.imgSrc}></img><br></br>
        <div id="breed-choice">
          <span>Choose a breed:&nbsp;&nbsp;</span>
          <select id="breed-select" onChange={this.breedSelectionHandler}>
            {this.breeds && this.breeds.map(breed => (
                <option value={breed}>{breed.charAt(0).toUpperCase() + breed.substr(1)}</option>
            ))}
        </select>
          <button id="go-button" onClick={this.handleBreedGoButtonClick}>Go</button>
        </div>
        <button id="random-button" onClick={this.handleRandomButtonClick}>Show Me A Random Doggo</button>
      </div>
    );
  }

}
