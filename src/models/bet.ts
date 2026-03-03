//hs2ue7Ce8RiGmNWv
import mongoose from 'mongoose';

const betSChema = new mongoose.Schema({
  gameId: {type: Number, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  teamId: {type: Number, required: true},
  predictedResult: {type: String, enum: ['win', 'draw', 'lose'], required: true},
  status: {type: String, enum: ['pending', 'won', 'lost'], default: 'pending'},
  amount: {type: Number, required: true},
})

const Bet = mongoose.model('Bet', betSChema);

export default Bet;