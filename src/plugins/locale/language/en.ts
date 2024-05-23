export default {
  en: {
    languageType: {
      zh: "chinese",
      en: "english",
    },
    sidebar: {
      newChatBtnText: "new chat",
      newChatText: "new chat",
      confirmDelete: {
        title: "please confirm whether to delete this conversation",
        confirmBtnText: "confirm delete",
        cancelBtnText: "cancel",
      },
    },
    conversation: {
      apiUnAvailable: "API address connection failed, please confirm the configuration",
      needCreateNewChat: "please start a new conversation first",
      confirmReNameText: "please enter the conversation name",
      refreshBtnText: "refresh and retry",
    },
    settings: {
      btns: {
        modelList: "model table",
        promptList: "prompt table",
        pullModel: {
          text: "pull model",
          elMessageBox: {
            title: "please enter the model name",
            confirmBtnText: "confirm",
            cancelBtnText: "cancel",
            warnText: "please enter the model name to pull",
          },
          pullSuccess: "pull model completed",
        },
        clearChats: {
          text: "clear chats",
          confirmClear: {
            title: "please confirm whether to clear the conversation",
            confirmBtnText: "confirm clear",
            cancelBtnText: "cancel",
          },
        },
      },
      settingText: "setting",
      settingForm: {
        ollamaApiUrl: "ollamaApi address",
        streamResponse: "stream response",
        withHistory: "with history",
        numCtx: "num_ctx",
        seed: "seed",
        topK: "top_k",
        topP: "top_p",
        uploadImagesLimit: "upload file limit",
      },
      pullModelMsg: "model download progress"
    },
    chatInput: {
      stopChat: "stop generating",
      warnText: "please enter your question or request",
      confirmDelete: {
        title: "delete picture",
        confirmBtnText: "confirm delete",
        cancelBtnText: "cancel",
      },
      overLimit: "upload over limit",
      uploadTypeError: "file type error, please upload images",
    },
    chatMessage: {},
    chatMessages: {
      aiRespondingMessage: "generating, please wait...",
    },
    aiMessage: {
      markDownTitle: "click to copy to clipboard",
      copySucccess: "copy success",
      copyFailed: "copy failed",
    },
    systemMessage: {},
    userMessage: {
      markDownTitle: "click to copy to chatinput",
    },
    modelSelector: {
      selectPlaceholder: "please choose model",
      noMatchText: "no match data",
      noDataText: "no data",
      iconText: "refresh model",
    },
    modelTable: {
      noDataText: "no data",
      columnModelName: "name",
      columnAction: "action",
      confirmDelete: {
        title: "please confirm whether to delete this model",
        confirmBtnText: "confirm delete",
        cancelBtnText: "cancel",
      },
      deleteText: "delete",
      deleteSuccess: "delete success",
      deleteFailed: "delete failed",
    },
    promptSelector: {
      selectPlaceholder: "please choose prompt",
      noMatchText: "no match data",
      noDataText: "no data",
      iconText: "refresh prompt",
    },
    promptTable: {
      headerBtns: {
        addBtn: {
          text: "add prompt",
          form: {
            columnName: "name",
            columnNamePlaceholder: "please enter name",
            columnContent: "content",
            columnContentPlaceholder: "please enter content",
            confirmBtnText: "confirm",
            cancelBtnText: "cancel",
          },
        },
        clearBtn: {
          text: "clear prompts",
          confirmClear: {
            title: "please confirm whether to clear the prompts",
            confirmBtnText: "confirm clear",
            cancelBtnText: "cancel",
          },
        },
      },
      table: {
        noDataText: "no data",
        columnPromptName: "name",
        columnAction: "action",
        deleteText: "delete",
        editText: "edit",
        confirmDelete: {
          title: "please confirm whether to delete this prompt",
          confirmBtnText: "confirm delete",
          cancelBtnText: "cancel",
        },
      },
      updateSuccessText: "update success",
      deleteSuccessText: "delete success",
      clearSuccessText: "clear success",
    },
    textArea: {},
    textInput: {},
    textRadio: {
      yes: "yes",
      no: "no",
    },
    promptConfig: {
      formRules: {
        nameMessage: {
          required: "please enter name",
          minMax: "the name cannot exceed 20 characters",
        },
        contentMessage: {
          required: "please enter content",
          minMax: "the content cannot exceed 4000 characters",
        },
      },
    },
    chatUtils: {
      generateChatError: "chat error",
    },
  },
};
