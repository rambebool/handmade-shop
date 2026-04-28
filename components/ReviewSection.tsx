"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Review, Question } from "@/lib/types";
import {
  getProductReviews,
  addReview,
  getProductQuestions,
  addQuestion,
  answerQuestion,
} from "@/lib/store";

export default function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"reviews" | "questions">("reviews");
  const [reviews, setReviews] = useState<Review[]>(() => getProductReviews(productId));
  const [questions, setQuestions] = useState<Question[]>(() => getProductQuestions(productId));
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);

  const handleReview = () => {
    if (!user || !reviewText.trim()) return;
    addReview({
      productId,
      userId: user.id,
      userLogin: user.displayName || user.login,
      rating,
      text: reviewText.trim(),
    });
    setReviews(getProductReviews(productId));
    setReviewText("");
    setRating(5);
  };

  const handleQuestion = () => {
    if (!user || !questionText.trim()) return;
    addQuestion({
      productId,
      userId: user.id,
      userLogin: user.displayName || user.login,
      text: questionText.trim(),
    });
    setQuestions(getProductQuestions(productId));
    setQuestionText("");
  };

  const handleAnswer = (questionId: string) => {
    if (!user || !answerText.trim()) return;
    answerQuestion(questionId, answerText.trim(), user.displayName || user.login);
    setQuestions(getProductQuestions(productId));
    setAnsweringId(null);
    setAnswerText("");
  };

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="mt-8 border-t-2 border-black/80 pt-6">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("reviews")}
          className={`border-2 px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
            tab === "reviews"
              ? "border-black/80 bg-[#FF4D00] text-white shadow-[2px_2px_0px_#1A1A1A]"
              : "border-black/40 bg-white text-[#1A1A1A] hover:border-black/80"
          }`}
        >
          Отзывы ({reviews.length})
        </button>
        <button
          onClick={() => setTab("questions")}
          className={`border-2 px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
            tab === "questions"
              ? "border-black/80 bg-[#FF4D00] text-white shadow-[2px_2px_0px_#1A1A1A]"
              : "border-black/40 bg-white text-[#1A1A1A] hover:border-black/80"
          }`}
        >
          Вопросы ({questions.length})
        </button>
        {reviews.length > 0 && (
          <span className="ml-auto flex items-center font-mono text-sm">
            <span className="text-[#EAB308]">{stars(Math.round(Number(avgRating)))}</span>
            <span className="ml-1 font-bold">{avgRating}</span>
          </span>
        )}
      </div>

      {/* Reviews tab */}
      {tab === "reviews" && (
        <div className="space-y-4">
          {user ? (
            <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
              <h3 className="mb-2 font-mono text-xs font-bold uppercase text-gray-500">
                Оставить отзыв
              </h3>
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-gray-500">Оценка:</span>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    className={`text-xl ${n <= rating ? "text-[#EAB308]" : "text-gray-300"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                placeholder="Ваш отзыв..."
                className="w-full border-2 border-black/80 px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              />
              <button
                onClick={handleReview}
                disabled={!reviewText.trim()}
                className="mt-2 border-2 border-black/80 bg-[#FF4D00] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#1A1A1A] disabled:bg-gray-300 disabled:shadow-none"
              >
                Отправить
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 p-4 text-center">
              <p className="font-mono text-sm text-gray-500">
                <a href="/auth" className="text-[#FF4D00] underline">Войдите</a>, чтобы оставить отзыв
              </p>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="py-4 text-center font-mono text-sm text-gray-400">Пока нет отзывов</p>
          ) : (
            reviews
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((rev) => (
                <div key={rev.id} className="border-2 border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold">{rev.userLogin}</span>
                    <span className="font-mono text-xs text-gray-400">
                      {new Date(rev.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <p className="text-[#EAB308]">{stars(rev.rating)}</p>
                  <p className="mt-1 font-mono text-sm text-gray-700">{rev.text}</p>
                </div>
              ))
          )}
        </div>
      )}

      {/* Questions tab */}
      {tab === "questions" && (
        <div className="space-y-4">
          {user ? (
            <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
              <h3 className="mb-2 font-mono text-xs font-bold uppercase text-gray-500">
                Задать вопрос
              </h3>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={2}
                placeholder="Ваш вопрос..."
                className="w-full border-2 border-black/80 px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              />
              <button
                onClick={handleQuestion}
                disabled={!questionText.trim()}
                className="mt-2 border-2 border-black/80 bg-[#1A1A1A] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#FF4D00] disabled:bg-gray-300 disabled:shadow-none"
              >
                Отправить
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 p-4 text-center">
              <p className="font-mono text-sm text-gray-500">
                <a href="/auth" className="text-[#FF4D00] underline">Войдите</a>, чтобы задать вопрос
              </p>
            </div>
          )}

          {questions.length === 0 ? (
            <p className="py-4 text-center font-mono text-sm text-gray-400">Пока нет вопросов</p>
          ) : (
            questions
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((q) => (
                <div key={q.id} className="border-2 border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold">{q.userLogin}</span>
                    <span className="font-mono text-xs text-gray-400">
                      {new Date(q.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-sm text-gray-700">{q.text}</p>
                  {q.answer ? (
                    <div className="mt-2 border-l-4 border-[#00E5FF] bg-[#F4F1EA] p-2">
                      <p className="font-mono text-xs font-bold text-[#00E5FF]">
                        Ответ от {q.answeredBy}:
                      </p>
                      <p className="font-mono text-sm">{q.answer}</p>
                    </div>
                  ) : user && (user.role === "admin" || user.role === "moderator") ? (
                    answeringId === q.id ? (
                      <div className="mt-2">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          rows={2}
                          className="w-full border-2 border-black/80 px-2 py-1 font-mono text-sm"
                          placeholder="Ваш ответ..."
                        />
                        <div className="mt-1 flex gap-2">
                          <button
                            onClick={() => handleAnswer(q.id)}
                            className="font-mono text-xs font-bold text-[#FF4D00] hover:underline"
                          >
                            Ответить
                          </button>
                          <button
                            onClick={() => setAnsweringId(null)}
                            className="font-mono text-xs text-gray-500 hover:underline"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAnsweringId(q.id); setAnswerText(""); }}
                        className="mt-1 font-mono text-xs text-[#FF4D00] hover:underline"
                      >
                        Ответить
                      </button>
                    )
                  ) : null}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
