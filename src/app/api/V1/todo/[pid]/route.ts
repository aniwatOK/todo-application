import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// url => api/v1/todo/pid
export async function GET(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;
    
    // ตรวจสอบว่า pid เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    await connectToDatabase();
    const todoResult = await Todo.findById(pid);

    if (!todoResult) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: todoResult });
  } catch (err) {
    console.error("Error fetching todo:", err);
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;
    const body = await req.json();

    // ตรวจสอบว่า pid เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    await connectToDatabase();
    const updatedTodo = await Todo.findByIdAndUpdate(pid, body, {
      new: true, 
      runValidators: true,
    });

    if (!updatedTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updatedTodo });
  } catch (err) {
    console.error("Error updating todo:", err);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { pid: string } }
) {
  try {
    const { pid } = params;

    // ตรวจสอบว่า pid เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    await connectToDatabase();
    const deleteResult = await Todo.findByIdAndDelete(pid);

    if (!deleteResult) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
