import { Emoji, EmojiStyle } from "emoji-picker-react";

interface IPropsEmojiButton {
  emojiName: string;
  emojiCount: number;
  onClick?: () => void;
}

const EmojiButton = ({ emojiName, emojiCount, onClick }: IPropsEmojiButton) => {
  return (
    <button
      onClick={onClick}
      key={emojiName}
      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-200 bg-slate-50"
    >
      <Emoji unified={emojiName} emojiStyle={EmojiStyle.APPLE} size={18} />
      <div className="text-sm">{emojiCount}</div>
    </button>
  );
};

export default EmojiButton;
