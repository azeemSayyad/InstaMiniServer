import mongoose from "mongoose";
import User from "../Modals/User.js";

export const getUser = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findById(id);

    let friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    let formatted = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formatted);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    let friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    let formatted = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formatted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getActiveUsers = async(req,res)=>{
  try{
    let users = await User.find();
    let activeUsers = []
    for(let user of users){
      if(user.active) activeUsers.push(user);
    }
    activeUsers = activeUsers.map(({firstName,lastName,picturePath})=>{
      return {name:firstName+' '+lastName,picturePath}}
      )
    res.status(200).json(activeUsers);
  }catch(err){
    res.status(500).json(err);
  }
}