export const faqItems = [
  {
    question: 'Is Sprite Smithy really free?',
    answer:
      'Yes! Currently, all features are completely free to use with no credit card required and no hidden limits on the number of sprites you can create.',
  },
  {
    question: 'Do I need to install any software?',
    answer:
      'No. Sprite Smithy is a fully browser-based tool. All processing happens locally in your browser, meaning you don\'t need to download or install anything to get started.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. Since all processing is deterministic and browser-based, your videos and images are never uploaded to a cloud server. Your creative assets stay on your machine.',
  },
  {
    question: 'What video formats are supported?',
    answer: 'We currently support MP4, WebM, and MOV files up to 100MB.',
  },
  {
    question: 'What kind of metadata is included in the export?',
    answer:
      'When you export your project, we provide a ZIP file containing the sprite sheet, individual PNG frames, and a metadata file (JSON) to make integration into engines like Unity, Godot, or Unreal Engine seamless.',
  },
  {
    question: 'Can I use this for non-AI generated videos?',
    answer:
      'While Sprite Smithy is optimized for the specific quirks of AI video (like haloing and inconsistent backgrounds), you can use it to convert any video into a sprite sheet.',
  },
  {
    question: 'How does the "Halo Removal" feature work?',
    answer:
      'AI-generated videos often have "ghosting" or color bleeding around the edges of a character. Our advanced post-processing detects these artifacts and cleans the edges so your sprites look crisp against any game background.',
  },
  {
    question: 'What is "Auto-Normalization"?',
    answer:
      'If your character moves slightly within the frame or changes size during the video, our Auto-Crop & Normalize feature detects the bounding box of the character in every frame and centers them consistently so the animation doesn\'t "jitter" in-game.',
  },
  {
    question: 'How do I get a perfect loop?',
    answer:
      'Our interface allows for frame-by-frame precision. You can scrub through your uploaded video to select the exact start and end frames to ensure your walk, idle, or attack cycles loop perfectly.',
  },
];
