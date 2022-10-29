import React, { useState } from "react";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";

interface IPropsEmojiButtonWithOpenModal {
  postId: string;
  onSelectEmoji: (
    postId: string,
    emojiData: EmojiClickData,
    event: MouseEvent
  ) => void;
}
const EmojiButtonWithOpenModal = ({ postId, onSelectEmoji }: IPropsEmojiButtonWithOpenModal) => {
  const [isOpenEmojiModal, setIsOpenEmojiModal] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpenEmojiModal(true)}
        className="px-4 py-2 text-sm rounded-md hover:bg-slate-200 bg-slate-50"
      >
        + emoji
      </button>
      {isOpenEmojiModal && (
        <div className="absolute top-0">
          <EmojiPicker
            onEmojiClick={(emojiData, event) => {
              onSelectEmoji(postId, emojiData, event);
              setIsOpenEmojiModal(false);
            }}
            autoFocusSearch={false}
            theme={Theme.AUTO}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiButtonWithOpenModal;
