import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// CRUD => CREATE, UPDATE, READ, DELETE
// url => api/v1/todo

// GET: Read all Todos
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({}).select('-__v'); // Exclude __v field
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    console.error("Error fetching todos:", err);
    return NextResponse.json({
      error: "Failed to fetch todos",
    }, { status: 500 });
  }
}

// POST: Create a new Todo
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTodo = { ...body, status: false };
    
    await connectToDatabase();
    const res = await Todo.create(newTodo);
    
    return NextResponse.json({ data: res }, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to create todo',
    }, { status: 500 });
  }
}

// PUT: Update Todo's status
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    // ตรวจสอบว่า id เป็น ObjectId ที่ถูกต้อง
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const res = await Todo.updateOne({ _id: id }, { status });

    if (res.matchedCount === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: res });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to update todo',
    }, { status: 500 });
  }
}

// DELETE: Remove a Todo by ID
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    // ตรวจสอบว่า id เป็น ObjectId ที่ถูกต้อง
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await connectToDatabase();
    const res = await Todo.deleteOne({ _id: id });

    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "No task found with the provided ID" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Failed to delete task",
    }, { status: 500 });
  }
}
