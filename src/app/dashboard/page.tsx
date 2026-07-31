import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Book } from "@/models/Book";
import { getSession } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";
import type { Book as BookType } from "@/types";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.userId).select("name email");

  if (!user) {
    redirect("/login");
  }

  const books = await Book.find({ userId: session.userId }).sort({
    updatedAt: -1,
  });

  const initialBooks: BookType[] = books.map((book) => ({
    _id: book._id.toString(),
    title: book.title,
    author: book.author,
    tags: book.tags,
    status: book.status,
    createdAt: book.createdAt.toISOString(),
    updatedAt: book.updatedAt.toISOString(),
  }));

  return (
    <Dashboard
      user={{
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
      }}
      initialBooks={initialBooks}
    />
  );
}
