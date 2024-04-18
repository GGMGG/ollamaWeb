export default {
  zh: {
    languageType: {
      zh: "中文",
      en: "英文",
    },
    sidebar: {
      newChatBtnText: "新建对话",
      newChatText: "新的对话",
      confirmDelete: {
        title: "请确定是否删除该对话",
        confirmBtnText: "确认删除",
        cancelBtnText: "取消",
      },
    },
    conversation: {
      apiUnAvailable: "api地址连接失败，请确认配置",
      needCreateNewChat: "请先新建对话",
      confirmReNameText: "请输入对话名称",
    },
    settings: {
      btns: {
        modelList: "模型列表",
        promptList: "提示词列表",
        pullModel: {
          text: "拉取模型",
          elMessageBox: {
            title: "请输入模型名称",
            confirmBtnText: "确认",
            cancelBtnText: "取消",
          },
          pullSuccess: "获取模型完成",
        },
        clearChats: {
          text: "清空对话",
          confirmClear: {
            title: "请确定是否清空对话",
            confirmBtnText: "确认清空",
            cancelBtnText: "取消",
          },
        },
      },
      settingText: "设置",
      settingForm: {
        ollamaApiUrl: "ollamaApi地址",
        streamResponse: "是否stream流响应",
        withHistory: "是否携带历史记录",
        numCtx: "num_ctx配置",
        seed: "seed配置",
        topK: "top_k配置",
        topP: "top_p配置",
      },
    },
    chatInput: {
      stopChat: "停止发送",
      warnText: "请输入你的问题或需求",
    },
    chatMessage: {},
    chatMessages: {},
    aiMessage: {},
    systemMessage: {},
    userMessage: {},
    modelSelector: {
      selectPlaceholder: "请选择模型",
      noMatchText: "暂无匹配数据",
      noDataText: "暂无数据",
      iconText: "刷新模型",
    },
    modelTable: {
      noDataText: "暂无数据",
      columnModelName: "模型名称",
      columnAction: "操作",
      confirmDelete: {
        title: "请确定是否删除该模型",
        confirmBtnText: "确认删除",
        cancelBtnText: "取消",
      },
      deleteText: "删除",
      deleteSuccess: "删除模型成功",
      deleteFailed: "删除模型失败",
    },
    promptSelector: {
      selectPlaceholder: "请选择提示词",
      noMatchText: "暂无匹配数据",
      noDataText: "暂无数据",
      iconText: "刷新提示词",
    },
    promptTable: {
      headerBtns: {
        addBtn: {
          text: "添加提示词",
          form: {
            columnName: "名称",
            columnNamePlaceholder: "请输入提示词名称",
            columnContent: "内容",
            columnContentPlaceholder: "请输入提示词内容",
            confirmBtnText: "确认",
            cancelBtnText: "取消",
          },
        },
        clearBtn: {
          text: "清空提示词",
          confirmClear: {
            title: "请确定是否清空提示词",
            confirmBtnText: "确认清空",
            cancelBtnText: "取消",
          },
        },
      },
      table: {
        noDataText: "暂无数据",
        columnPromptName: "提示词名称",
        columnAction: "操作",
        deleteText: "删除",
        editText: "编辑",
        confirmDelete: {
          title: "请确定是否删除该提示词",
          confirmBtnText: "确认删除",
          cancelBtnText: "取消",
        },
      },
      updateSuccessText: "更新成功",
      deleteSuccessText: "删除成功",
      clearSuccessText: "清空成功",
    },
    textArea: {},
    textInput: {},
    textRadio: {
      yes: "是",
      no: "否",
    },
    promptConfig: {
      formRules: {
        nameMessage: {
          required: "请输入提示词名称",
          minMax: "名称不能超过20个字符",
        },
        contentMessage: {
          required: "请输入提示词内容",
          minMax: "内容不能超过4000个字符",
        },
      },
    },
  },
};
