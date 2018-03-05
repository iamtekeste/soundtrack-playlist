import React, { Component } from "react";
import axios from "axios";
import { debounce } from "../utils";
import SearchForm from "../components/SearchForm";
export default class Index extends Component {
  state = {
    selectedMovie: {},
    movies: [],
    isLoading: false,
    searchTerm: ""
  };
  handleChange = searchTerm => {
    this.setState({ searchTerm }, this.getMovieDetails);
  };
  handleSelect = selectedMovie => {
    this.setState({ selectedMovie }, this.getSoundTrackList);
  };
  getMovieDetails = debounce(() => {
    const tmdbURL = "https://api.themoviedb.org/3/search/movie";
    axios
      .get(tmdbURL, {
        params: {
          query: this.state.searchTerm,
          api_key: "e1ba7a7de4337da1bc251e9129fb8cba"
        }
      })
      .then(response => {
        this.setState({ movies: response.data.results });
      })
      .catch(error => {
        console.log(error);
      });
    console.log("...fetching movie details");
  });
  getSoundTrackList = selectedMovie => {
    if (selectedMovie === null) return;
    const soundtrackAPIURL = "/search";
    this.setState({ selectedMovie });
    axios
      .post(soundtrackAPIURL, {
        selectedMovie
      })
      .then(response => {
        console.log("client", response.data);
      });
  };
  render = () => {
    const { movies, isLoading } = this.state;
    return (
      <SearchForm
        movies={movies}
        isLoading={isLoading}
        handleChange={this.handleChange}
        handleSelect={this.getSoundTrackList}
      />
    );
  };
}
