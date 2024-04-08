export interface ChoiceView {
  id: string;
  onClick: () => void;
  className: string;
  text: string;
  disabled: boolean;
}

interface QuestionViewProps {
  choices: ChoiceView[];
  question: string;
  choiceLayout: string;
}

export default function QuestionView({ question, choices, choiceLayout }: QuestionViewProps) {
  return (
    <>
      <div className="text-3xl">{question}</div>
      <div className={choiceLayout}>
        {choices.map((choice) => (
          <button
            key={choice.id}
            disabled={choice.disabled}
            onClick={choice.onClick}
            className={choice.className}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </>
  );
}

