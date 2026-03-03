//hs2ue7Ce8RiGmNWv
import mongoose from 'mongoose';

const gameSChema = new mongoose.Schema({
    gameId: {type: Number, required: true, unique: true},
    homeTeamId: {type: Number, required: true},
    awayTeamId: {type: Number, required: true},
    leagueId: {type: Number, required: true},
    startsAt: {type: Date, required: true},
})

const Game = mongoose.model('Game', gameSChema);

export default Game;