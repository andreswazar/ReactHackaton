import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from './PokemonProfile/PokemonProfile';
import PokemonData from './PokemonData/PokemonData';
import '../perType/perType.css';
import { Redirect } from 'react-router-dom';

// Function for making sure that the value passed to URL will be an integer
function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
}

export default function DetailPokemon(props) {
    //Variable to store the wanted pokemon (this is just temporary)
    let pkmName = props.match.params.pokemon;
    
    //Excludes the 8th generation
    const highestValidID = 809;

    //Constructor to store the data from the api
    const [pokemonData, setPokemonData] = useState({
        image: null,
        id: null,
        name: null,
        types: null,
        height: null,
        weight: null,
        abilities: null,
        moves: null,
    });

    const [redirectState, setRedirectState] = useState({
        redirect: null 
     });

    //Make an HTTP request  to the API to get the selected data
    useEffect(() => {

        // Prevents invalid URLs if the ID param isn't an integer or outside of a certain range
        if ( !redirectState.redirect && (!isInt(pkmName) || ( 0 >= +pkmName || +pkmName > highestValidID ))) {
            setRedirectState({
                redirect: <Redirect to="/home"/>
            }); 
        } else if (!redirectState.redirect && !pokemonData.abilities){
            axios.get(`https://pokeapi.co/api/v2/pokemon/${pkmName}`).then(response =>{
                setPokemonData({
                    image: response.data.sprites.other['official-artwork'].front_default,
                    id: response.data.id,
                    name: response.data.name,
                    types: response.data.types,
                    height: response.data.height,
                    weight: response.data.weight,
                    abilities: response.data.abilities,
                    moves: response.data.moves
                });
            });
        }
    });

    //Helpers conditions to access the wanted data from the api
    let pkmTypes;
    if(pokemonData.types){
        pkmTypes = pokemonData.types.map((element) => {
            return <li className={element.type.name} key={element.type.name} >{element.type.name}</li>
        });
    }

    let pkmAbilities;
    if(pokemonData.abilities){
        pkmAbilities = pokemonData.abilities.map((element) =>{
            return <li key={element.ability.name}>{element.ability.name}</li>
        });
    }

    let pkmAttack;
    if(pokemonData.moves){
        pkmAttack = pokemonData.moves.map((element) => {
            return <li className = "list-group-item text-capitalize" key={element.move.name} >{element.move.name}</li>
        });
    }

    //Rendering variables
    return(
        <div className="row mx-auto">
            {redirectState.redirect}
            <Profile image={pokemonData.image} types={pkmTypes}/>

            <PokemonData 
                id = {pokemonData.id}
                name = {pokemonData.name}
                height = {pokemonData.height}
                weight = {pokemonData.weight}
                abilities = {pkmAbilities}
                attacks = {pkmAttack}
            />

        </div>
    );
}