// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "react-quill/dist/quill.snow.css";
// import dynamic from "next/dynamic";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const Input = (props) => <input {...props} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm" />;
// const Label = ({ children }) => <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
// const Button = ({ children, ...props }) => <button {...props} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium" >{children}</button>;
// const Textarea = (props) => <textarea {...props} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm" />;
// const Checkbox = ({ checked, onChange }) => <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />;
// const Select = ({ value, onChange, options }) => (
//   <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm">
//     {options.map((opt) => (
//       <option key={opt} value={opt}>{opt}</option>
//     ))}
//   </select>
// );

// const InputWrapper = ({ label, children }) => (
//   <div className="space-y-1">
//     <Label>{label}</Label>
//     {children}
//   </div>
// );

// const quillModules = {
//   toolbar: [
//     [{ header: [1, 2, 3, false] }],
//     ["bold", "italic", "underline", "strike"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["blockquote", "code-block"],
//     ["link"],
//     ["clean"],
//   ],
// };

// const QuestionForm = ({ exam = {}, question, setView }) => {
//   const [questionText, setQuestionText] = useState("");
//   const [questionImage, setQuestionImage] = useState("");
//   const [options, setOptions] = useState([
//     { text: "", image: "" },
//     { text: "", image: "" },
//     { text: "", image: "" },
//     { text: "", image: "" },
//   ]);
//   const [correctAnswers, setCorrectAnswers] = useState([false, false, false, false]);
//   const [isSample, setIsSample] = useState(false);
//   const [type, setType] = useState("radio");
//   const [status, setStatus] = useState("publish");
//   const [marks, setMarks] = useState(1);
//   const [negativeMarks, setNegativeMarks] = useState(0);
//   const [difficulty, setDifficulty] = useState("Easy");
//   const [explanation, setExplanation] = useState("");
//   const [tags, setTags] = useState("");
//   const [subject, setSubject] = useState("");
//   const [topic, setTopic] = useState("");

//   useEffect(() => {
//     if (question) {
//       setQuestionText(question.questionText || "");
//       setQuestionImage(question.questionImage || "");
//       setOptions(
//         question.options?.map((o) => ({ text: o.text, image: o.image || "" })) || options
//       );
//       setCorrectAnswers(
//         ["A", "B", "C", "D"].map((label) => question.correctAnswers?.includes(label))
//       );
//       setIsSample(question.isSample || false);
//       setType(question.questionType || "radio");
//       setStatus(question.status || "publish");
//       setMarks(question.marks || 1);
//       setNegativeMarks(question.negativeMarks || 0);
//       setDifficulty(question.difficulty || "Easy");
//       setExplanation(question.explanation || "");
//       setTags(question.tags?.join(", ") || "");
//       setSubject(question.subject || "");
//       setTopic(question.topic || "");
//     }
//   }, [question]);

//   const toggleCorrectAnswer = (index) => {
//     const updated = [...correctAnswers];
//     updated[index] = !updated[index];
//     setCorrectAnswers(updated);
//     setType(updated.filter(Boolean).length > 1 ? "checkbox" : "radio");
//   };

//   const uploadImage = async (file, setImageFn) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const res = await axios.post("http://localhost:8000/api/questions/upload", formData);
//       setImageFn(res.data.secure_url);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//     }
//   };

//   const handleOptionImageUpload = (e, index) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     uploadImage(file, (url) => {
//       const updated = [...options];
//       updated[index].image = url;
//       setOptions(updated);
//     });
//   };

//   const handleQuestionImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     uploadImage(file, setQuestionImage);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       examId: exam._id,
//       questionText,
//       questionImage,
//       questionType: type,
//       difficulty,
//       marks,
//       negativeMarks,
//       subject,
//       topic,
//       tags: tags.split(",").map((tag) => tag.trim()),
//       explanation,
//       options: options.map((opt, i) => ({
//         label: "ABCD"[i],
//         text: opt.text,
//         image: opt.image,
//       })),
//       correctAnswers: correctAnswers.map((isCorrect, i) => (isCorrect ? "ABCD"[i] : null)).filter(Boolean),
//       isSample,
//       status,
//     };

//     try {
//       if (question) {
//         await axios.put(`http://localhost:8000/api/questions/${question._id}`, payload);
//       } else {
//         await axios.post("http://localhost:8000/api/questions", payload);
//       }
//       setView("manageQuestions");
//     } catch (err) {
//       console.error("Error saving question:", err);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 bg-white rounded-md shadow-md border">
//       <Button type="button" onClick={() => setView("manageQuestions")}>← Back</Button>
//       <h2 className="text-2xl font-semibold text-gray-800">{question ? "Edit" : "Add"} Question</h2>
//       <form onSubmit={handleSubmit} className="grid gap-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <InputWrapper label="Exam Code">
//             <Input type="text" value={question?.questionCode || exam.code || ""} disabled />
//           </InputWrapper>
//           <InputWrapper label="Question Type (auto)">
//             <Input type="text" value={type} readOnly />
//           </InputWrapper>
//           <InputWrapper label="Marks">
//             <Input type="number" value={marks} onChange={(e) => setMarks(+e.target.value)} />
//           </InputWrapper>
//           <InputWrapper label="Negative Marks">
//             <Input type="number" value={negativeMarks} onChange={(e) => setNegativeMarks(+e.target.value)} />
//           </InputWrapper>
//           <InputWrapper label="Difficulty">
//             <Select value={difficulty} onChange={setDifficulty} options={["Easy", "Medium", "Hard"]} />
//           </InputWrapper>
//           <InputWrapper label="Status">
//             <Select value={status} onChange={setStatus} options={["publish", "draft"]} />
//           </InputWrapper>
//           <InputWrapper label="Subject">
//             <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
//           </InputWrapper>
//           <InputWrapper label="Topic">
//             <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
//           </InputWrapper>
//           <InputWrapper label="Tags (comma separated)">
//             <Input value={tags} onChange={(e) => setTags(e.target.value)} />
//           </InputWrapper>
//           <InputWrapper label="Add to Sample">
//             <div className="flex items-center gap-2">
//               <Checkbox checked={isSample} onChange={() => setIsSample(!isSample)} />
//               <span>Yes</span>
//             </div>
//           </InputWrapper>
//         </div>

//         <InputWrapper label="Question Text">
//           <ReactQuill theme="snow" modules={quillModules} value={questionText} onChange={setQuestionText} />
//         </InputWrapper>

//         <InputWrapper label="Question Image (Optional)">
//           <Input type="file" accept="image/*" onChange={handleQuestionImageUpload} />
//           {questionImage && <img src={questionImage} alt="question" className="max-h-32 mt-2 rounded" />}
//         </InputWrapper>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {options.map((opt, i) => (
//             <div key={i} className="border p-4 rounded-md space-y-2">
//               <Label>Option {"ABCD"[i]}</Label>
//               <ReactQuill theme="snow" modules={quillModules} value={opt.text} onChange={(v) => {
//                 const updated = [...options];
//                 updated[i].text = v;
//                 setOptions(updated);
//               }} />
//               <Input type="file" accept="image/*" onChange={(e) => handleOptionImageUpload(e, i)} />
//               {opt.image && <img src={opt.image} alt={`Option ${i + 1}`} className="max-h-24 mt-2 rounded" />}
//               <div className="flex items-center gap-2">
//                 <Checkbox checked={correctAnswers[i]} onChange={() => toggleCorrectAnswer(i)} />
//                 <span className="text-sm">Correct Answer</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <InputWrapper label="Explanation">
//           <ReactQuill theme="snow" modules={quillModules} value={explanation} onChange={setExplanation} />
//         </InputWrapper>

//         <div className="flex justify-end">
//           <Button type="submit">{question ? "Update Question" : "Save Question"}</Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default QuestionForm;
