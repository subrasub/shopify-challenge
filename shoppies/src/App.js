import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '20ch',
    },
}));

function App() {
    const [movies, setMovies] = useState([])
    const [nominations, setNominations] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [disabled, setDisabled] = useState([])

    const classes = useStyles();

    useEffect(() => {
        axios.get(`https://www.omdbapi.com/?s=${searchTerm.trim()}&apikey=d8a066c3`)
        .then(res => {
            console.log(res)
            setMovies(res.data.Search.splice(0,5))
        })
        .catch(err => {
            console.log(err)
        })
    }, [searchTerm])

    useEffect(() => {
        console.log("changes to nominations")
    }, [nominations])

    const handleSearchInputChanges = (e) => {
        setSearchTerm(e.target.value)
    }


    function handleNominate (movie) {
        console.log(movie)
        var nom = { id : movie.imdbID, Title: movie.Title, Year: movie.Year }

        setNominations([...nominations, nom])
        setDisabled(disabled => [...disabled, movie.imdbID]);
        console.log(disabled)
        console.log(nominations)
    }

    function handleRemove (movieID) {
        setDisabled(disabled => disabled.filter(item => item !== movieID))

        setNominations(nominations => nominations.filter(item => item.id !== movieID))
        console.log(nominations)
    }
    
    return (
        <div className="App"> 
            <div className="container">
                
                <div className="searchbar">
                    <h2>The Shoppies</h2>
                    
                    <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Movie Title</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        value={searchTerm}
                        onChange={handleSearchInputChanges}
                        startAdornment={<InputAdornment position="start"><SearchIcon/></InputAdornment>}
                        labelWidth={80}
                    />
                    </FormControl>
                </div>

                
                <div className="info">
                    <div className="results">
                        <div className="result-block">

                        {!searchTerm? <b>Your search results will display here.</b> : <b>Results for: "{searchTerm}"</b>}

                        {   searchTerm && movies && 
                            movies.map((movie) => (
                                <div key={movie.imdbID} className="movieList">
                                    <li>{movie.Title} ({movie.Year})</li>
                                    <button disabled={disabled.indexOf(movie.imdbID) !== -1} onClick={()=> handleNominate(movie)}>Nominate</button>
                                </div>
                            ))
                        }

                        </div>
                        
                        <div className="result-block">
                            <b>Nominations </b>
                            {nominations.length? nominations.map((movie, index) => (
                                
                                <div key={index} className="movieList">
                                    <li>{movie.Title} ({movie.Year})</li>
                                    <button onClick={()=>handleRemove(movie.id)}>Remove</button>
                                </div>
                            )) : <text>: You have no nominations yet!</text>}
                        </div>
                    </div>
                    {   nominations.length === 5 && 
                        <div className="nomination-complete">
                            <h3>You have nominated 5/5 movies!</h3>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;