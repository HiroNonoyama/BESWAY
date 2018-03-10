import React from "react";
import classNames from "classnames";
import FontAwesome from "react-fontawesome";

import TextInputWithAutoComplete from "../components/TextInput";
import styles from "../../styles/containers/Search.scss";

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: ["Tokyo tower"],
    };
    this._handleAddButton = this._handleAddButton.bind(this);
    this._searchDirection = this._searchDirection.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: { lat: 41.85, lng: -87.65 },
      });

      this.directionsDisplay.setMap(this.map);
    }, 1000);
    global._searchDirection = this._searchDirection;
  }

  _handleAddButton() {
    const { form } = this.state;
    this.setState({ form: [...form, ""] });
  }

  _searchDirection() {
    const { form } = this.state;
    const origin = document.getElementById("textInput-START").value;
    const destination = document.getElementById("textInput-GOAL").value;
    const waypoints = form
      .filter(
        (_, index) =>
          document.getElementById(`textInput-VIA${index + 1}`).value !== ""
      )
      .map((_, index) => ({
        location: document.getElementById(`textInput-VIA${index + 1}`).value,
      }));

    const request = {
      origin,
      destination,
      waypoints,
      provideRouteAlternatives: false,
      travelMode: "DRIVING",
      optimizeWaypoints: true,
    };

    this.directionsService.route(request, (result, status) => {
      if (status === "OK") this.directionsDisplay.setDirections(result);
    });
  }

  _handleRemoveButton(index, random) {
    const { form } = this.state;
    const nextForm = form.filter((_, i) => i !== index);
    const target = document.querySelector(`div[data-index="${random}"]`)
      .classList;
    target.remove(styles.fadeout);
    setTimeout(() => target.add(styles.fadeout), 20);
    setTimeout(() => {
      this.setState({ form: nextForm });
    }, 300);
  }

  render() {
    const { form } = this.state;

    return (
      <div className={styles.container}>
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInputWithAutoComplete
            placeholder="Tokyo station"
            label="START"
            ref="START"
          />
        </div>
        {form.map((placeholder, index) => {
          const random = Math.random();
          return (
            <div
              className={classNames(styles.wrap, styles.fadein)}
              key={index}
              data-index={random}
            >
              {form.length > 1 && (
                <a
                  className={styles.removeButton}
                  onClick={() => this._handleRemoveButton(index, random)}
                >
                  <FontAwesome name="times-circle" size="2x" />
                </a>
              )}
              <TextInputWithAutoComplete
                placeholder={placeholder}
                label={`VIA${index + 1}`}
              />
              {index === form.length - 1 && (
                <a className={styles.addButton} onClick={this._handleAddButton}>
                  <FontAwesome name="plus-circle" size="2x" />
                </a>
              )}
            </div>
          );
        })}
        <div className={classNames(styles.wrap, styles.fadein)}>
          <TextInputWithAutoComplete
            placeholder="Yokohama station"
            label="GOAL"
          />
        </div>
        <div className={styles.searchButtonWrap}>
          <input
            className={styles.searchButton}
            type="button"
            value="検索"
            onClick={this._searchDirection}
          />
        </div>
      </div>
    );
  }
}

export default Search;
