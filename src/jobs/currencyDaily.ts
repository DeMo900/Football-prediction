/*
import nodeCron from "node-cron";
import usermodel from "../models/user";

export default nodeCron.schedule('1 * * * *', async () => {
    console.log('Running daily coin addition task');
    try {
        const users = await usermodel.find({});
        for (const user of users) {
            user.coins += 100; // Add 100 coins to each user
            await user.save();
        }
        console.log('Daily coins added to all users');
    } catch (err) {
        console.error('Error adding daily coins:', err);
    }
});
*/