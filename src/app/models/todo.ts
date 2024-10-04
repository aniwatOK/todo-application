import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  duedate: {
    type: Date,
    required: true,
  },
});

// connect to the "Todo" model, Mongoose will create "todos" collection
const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default Todo;
