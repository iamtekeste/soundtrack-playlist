import React, { Component } from "react";
import axios from "axios";
import { debounce } from "../utils";
import SearchForm from "../components/SearchForm";
export default class Index extends Component {
  state = {
    currentPlaylistID: "47Ne6hrPVXzA72EhtVE93H",
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
        this.setState({
          movies: response.data.results
        });
      })
      .catch(error => {
        console.log(error);
      });
    console.log("...fetching movie details");
  });
  componentDidMount = () => {
    //this.getSoundTrackList({ title: "Black Panther", release_date: "2018" });
  };
  getSoundTrackList = selectedMovie => {
    if (selectedMovie === null) return;
    const soundtrackAPIURL = "/search";
    this.setState({ selectedMovie });
    axios.post(soundtrackAPIURL, { selectedMovie }).then(response => {
      this.setState({
        currentPlaylistID: response.data.playlistID
      });
    });
  };
  render = () => {
    const { movies, isLoading, currentPlaylistID } = this.state;
    return (
      <div>
        <SearchForm
          movies={movies}
          isLoading={isLoading}
          handleChange={this.handleChange}
          handleSelect={this.getSoundTrackList}
        />
        {/* <iframe
          src={`https://open.spotify.com/embed/user/12152339910/playlist/${currentPlaylistID}`}
          width="300"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
        /> */}
      </div>
    );
  };
}
