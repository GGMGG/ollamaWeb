import { format } from "date-fns";
import { ElMessage, ElNotification } from "element-plus";
import * as $math from "mathjs";
import i18n from "../locale/index.ts";

// 118n对象
const { t, locale } = i18n.global;

/**
 * 时间格式化
 */
export const formatDate = (date: string) => {
  const dataLocale = locale.value === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleDateString(dataLocale, {
    day: "2-digit",
    month: "short",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * 判断URL状态
 */
export const isUrlValid = (url: string) => {
  return fetch(url)
    .then((response) => {
      return response.ok;
    })
    .catch((error) => {
      return false;
    });
};

/**
 * 数组分组
 */
export const groupArr = (list: Record<any, any>, field: string) => {
  return list.reduce((result, obj) => {
    const group = obj[field];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(obj);
    return result;
  }, {});
};

/**
 * 图片转base64
 */
export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let fileResult = "";
    reader.readAsDataURL(file.raw);
    reader.onload = function () {
      fileResult = reader.result;
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.onloadend = function () {
      resolve(fileResult);
    };
  });
};

/**
 * 判断是否小数
 */
export const isDecimal = (num: number) => {
  return !isNaN(parseFloat(num)) && isFinite(num) && !Number.isInteger(num);
};

/**
 * mathjs封装
 */
export const math = () => {
  /**
   * ti + t2
   */
  const add = (t1 = 0, t2 = 0) => {
    return $math.format($math.add($math.bignumber(t1), $math.bignumber(t2)));
  };

  /**
   * ti - t2
   */
  const subtract = (t1 = 0, t2 = 0) => {
    return $math.format($math.subtract($math.bignumber(t1), $math.bignumber(t2)));
  };

  /**
   * ti X t2
   */
  const multiply = (t1 = 0, t2 = 0) => {
    return $math.format($math.multiply($math.bignumber(t1), $math.bignumber(t2)));
  };

  /**
   * ti / t2
   */
  const divide = (t1 = 0, t2 = 0) => {
    return $math.format($math.divide($math.bignumber(t1), $math.bignumber(t2)));
  };

  return {
    add,
    subtract,
    multiply,
    divide,
  };
};

/**
 * elmessage二次封装
 */
export const showMessage = () => {
  /**
   * info
   */
  const info = (msg: string) => {
    ElMessage(`${msg}`);
  };

  /**
   * success
   */
  const success = (msg: string) => {
    ElMessage({
      message: `${msg}`,
      type: "success",
    });
  };

  /**
   * warning
   */
  const warning = (msg: string) => {
    ElMessage({
      message: `${msg}`,
      type: "warning",
    });
  };

  /**
   * error
   */
  const error = (msg: string) => {
    ElMessage.error(`${msg}`);
  };

  return {
    info,
    success,
    warning,
    error,
  };
};

/**
 * elnotification
 */
export const showNotification = () => {
  /**
   * 动态调用notification
   */
  const showElNotification = (title: string = "", message: string = "", type: string = "", position: string = "bottom-right") => {
    ElNotification({
      title: `${title}`,
      message: `${message}`,
      type: type,
      position: `${position}`,
    });
  };

  /**
   * info
   */
  const info = (title: string, msg: string, position: string) => {
    showElNotification(title, msg, "info");
  };

  /**
   * success
   */
  const success = (title: string, msg: string, position: string) => {
    showElNotification(title, msg, "success");
  };

  /**
   * warning
   */
  const warning = (title: string, msg: string, position: string) => {
    showElNotification(title, msg, "warning");
  };

  /**
   * error
   */
  const error = (title: string, msg: string, position: string) => {
    showElNotification(title, msg, "error");
  };

  return {
    info,
    success,
    warning,
    error,
  };
};
