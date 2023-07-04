import axios from "axios";
import { useState } from "react";

//readonly hook
const READONLY_KEY = {
  accessKey: "AKIAQOG6UQPKL6QUDHJO",
  secretAccessKey: "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",
};

const BUCKET_URL = [
  "https://seoulpanorama2123",
  ".s3.ap-northeast-2.amazonaws.com/",
];

const getBucketUrl = (bucket_type) => {
  return BUCKET_URL.join(bucket_type === "" ? "" : "-" + bucket_type);
};

const useS3 = (object) => {
  const [s3_data, setS3Data] = useState();
};

// https://docs.aws.amazon.com/AmazonS3/latest/API
// action : "GetObject" | "ListBucket" | "ListObject"
export const requestS3Data = (bucket_type, action, file_path) => {
  switch (action) {
    case "GetObject":
      axios.get(getBucketUrl(bucket_type) + file_path);
    case "ListObject":
      axios.get(getBucketUrl(bucket_type) + "/?list-type=2");
  }
};

export const getS3URL = (bucket_type, file_path) => {
  return getBucketUrl(bucket_type) + file_path;
};

export default useS3;
