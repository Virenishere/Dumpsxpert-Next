"use client";
import { useParams } from "next/navigation";
import QuestionList from "../../questionManage/QuestionList";

export default function QuestionsPage() {
  const { examId } = useParams(); // yahan se milega

  console.log("Exam ID from URL:", examId);

  return <QuestionList examId={examId} />;
}
