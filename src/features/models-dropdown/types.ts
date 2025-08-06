export interface ModelType {
  name: string;
  title: string;
  description: string;
  provider?: ModelProviderType;
  type: string;
  serverless: boolean;
  contextLength: number;
  supportsImageInput: boolean;
  tags: TagsType;
  cost: CostType;
}

export interface ModelProviderType {
  name: string;
  hf: string;
  org: ProviderOrgType;
}

type TagsType = string[];

type ProviderOrgType = {
  name: string;
  logos?: LogosType;
};

type LogosType = {
  logomark?: SrcType;
  combomark?: SrcType;
};

type SrcType = {
  src: string;
};

type CostType = {
  inputTokenPrice: number;
  outputTokenPrice: number;
  tokenPrice: number;
};
