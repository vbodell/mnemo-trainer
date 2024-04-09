import { useState } from "react";
import classNames from "classnames";

import { ResponseChoice } from "./Game";
import { ChoiceView } from "../Views/QuestionView";
import QuestionView from "../Views/QuestionView";

interface QuestionPresenterProps {
  question: string;
  choices: ResponseChoice[];
  answerSubmitted: (arg0: boolean, arg1: () => void) => void;
}

export default function QuestionPresenter({
  question,
  choices,
  answerSubmitted,
}: QuestionPresenterProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const hasAnswered = selectedAnswer !== "";

  function submitResponse(id: string) {
    setSelectedAnswer(id);
    answerSubmitted(isCorrectAnswer(id), () => setSelectedAnswer(""));
  }
  function isCorrectAnswer(id: string): boolean {
    return id === question;
  }
  function isSelectedAnswer(id: string): boolean {
    return id === selectedAnswer;
  }

  const choiceViews: ChoiceView[] = choices.map(
    ({ question: id, answer: text }) => ({
      id: id,
      disabled: hasAnswered,
      text: text,
      onClick: () => submitResponse(id),
      className: classNames(
        "rounded",
        "p-2",
        hasAnswered && isCorrectAnswer(id)
          ? "bg-green-700"
          : isSelectedAnswer(id)
            ? "bg-red-700"
            : "bg-purple-700",
        !hasAnswered && "bg-purple-700",
      ),
    }),
  );
  const choiceLayout = "grid grid-cols-3 grid-rows-3 gap-2";

  return (
    <QuestionView
      question={question}
      choices={choiceViews}
      choiceLayout={choiceLayout}
    />
  );
}
