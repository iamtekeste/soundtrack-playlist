import React, { Component } from "react";
import Downshift from "downshift";
export default class Search extends Component {
  state = {
    isOpen: true
  };
  handleSelect = selectedMovie => {
    this.setState({ isOpen: false });
    this.props.handleSelect(selectedMovie);
  };
  getMovieTitle = movie => {
    let year = movie.release_date.split("-")[0];
    return `${movie.title} (${year})`;
  };
  render = () => {
    const { movies, handleChange } = this.props;
    return (
      <Downshift
        onSelect={this.handleSelect}
        itemToString={item => (item === null ? "" : this.getMovieTitle(item))}
        onOuterClick={e => this.setState({ isOpen: false })}
        isOpen={this.state.isOpen}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
          clearSelection
        }) => (
          <div className="movie-search">
            <input
              {...getInputProps({
                placeholder: "Search Movies",
                id: "movies",
                onChange: event => {
                  const value = event.target.value;
                  if (!value) {
                    clearSelection();
                    return;
                  }
                  this.setState({
                    isOpen: true
                  });
                  handleChange(value);
                }
              })}
            />
            {isOpen ? (
              <div className="movie-list">
                {movies
                  .filter(
                    i =>
                      !inputValue ||
                      i.title.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .map((item, index) => (
                    <div
                      className="movie-item"
                      {...getItemProps({ item })}
                      key={item.id}
                      style={
                        highlightedIndex === index
                          ? { backgroundColor: "#F2C94C" }
                          : {}
                      }
                    >
                      {this.getMovieTitle(item)}
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        )}
      />
    );
  };
}
