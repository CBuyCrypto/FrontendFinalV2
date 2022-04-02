import { FontAwesome } from "@expo/vector-icons";
import { ChainId, Fraction, Token, TokenAmount } from "@ubeswap/sdk";
import {
  useWalletConnect,
  useWalletConnectContext,
  withWalletConnect,
} from "@walletconnect/react-native-dapp";
import * as React from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import Web3 from "web3";
/*
import { Farm } from "../constants/FarmInfo";
import { useWeb3Connection } from "../state/application/hooks";
import { tryParseAmount } from "../state/swap/hooks";
import { useDefaultTokens } from "../state/tokens/hooks";
import { useWalletAddress } from "../state/user/hooks";
import { getColor } from "../styles/colors";
import { DEVICE_HEIGHT, DEVICE_WIDTH, layout, text } from "../styles/styles";
import { formatTokenAmount } from "../utils";
import { fetchAllBalances } from "../utils/fetchData";
import { formatTransfer } from "../utils/formatTransaction";
import { getErc20Contract } from "../utils/getContract";
import CurrencyLogo from "./CurrencyLogo";
import MultiTokenLogo from "./MultiTokenLogo";
import { StepContainer } from "./StepContainer";
import { Divider } from "./Themed";
import { ButtonConfirm, Text } from "./ThemedComponents";*/

type MigrationFlowProps = {
  onSuccess?: () => void;
};

export function MigrationFlow({ onSuccess }: MigrationFlowProps) {
  const [step, setStep] = React.useState<number>(1);
  const connection = useWalletConnect();

  return (
    <ScrollView>
      <ConnectWallet
        step={step}
        connect={connection.connect}
        onConnect={() => setStep(step + 1)}
      />
      <Divider color="white" opacity={0.5} marginTop={20} />
      <TransferFunds step={step} />
    </ScrollView>
  );
}

function ConnectWallet({
  step,
  connect,
  onConnect,
}: {
  step: number;
  connect: () => Promise<{ accounts: string[] }>;
  onConnect: () => void;
}) {
  return (
    <StepContainer
      step={1}
      currentStep={step}
      title="Connect your Celo Wallet"
      completedText="Wallet Connected"
    >
      <ButtonConfirm
        width={DEVICE_WIDTH * 0.1}
        onPress={async () => {
          const { accounts } = await connect();
          if (accounts && accounts[0]) {
            onConnect();
          }
        }}
        style={[
          layout.cardWithShadow,
          { width: "75%", backgroundColor: "black" },
        ]}
      >
        <Text
          style={[text.h1, text.center, { color: "white", paddingVertical: 5 }]}
        >
          Connect Wallet
        </Text>
      </ButtonConfirm>
    </StepContainer>
  );
}

async function transferToken(
  web3: Web3,
  amount: TokenAmount,
  connection: any,
  recipient: string
) {
  const txn = formatTransfer(web3, amount, recipient);
  return await connection
    .sendTransaction({ ...txn, from: connection.accounts[0] })
    .then(() => true)
    .catch((err) => {
      console.warn(err);
      return false;
    });
}

interface TokenMigrationRow {
  image: React.ReactElement;
  name: string;
  subName: string;
  amount: TokenAmount;
  snxAddress?: string;
  disclaimer?: string;
}

function TokenMigrationRow({
  image,
  name,
  subName,
  amount,
  snxAddress,
  disclaimer,
}: TokenMigrationRow) {
  const { web3 } = useWeb3Connection();
  const walletAddress = useWalletAddress();
  const connection = useWalletConnect();
  const [withdrawnFromSNX, setWithdrawnFromSNX] = React.useState(!snxAddress);
  const [transfered, setTransfered] = React.useState(false);

  return (
    <TouchableOpacity
      style={[
        layout.card,
        layout.row,
        layout.spaceBetween,
        transfered ? {} : layout.cardWithShadow,
        {
          width: DEVICE_WIDTH * 0.9,
          opacity: transfered ? 0.5 : 1,
          backgroundColor: "white",
          paddingVertical: 10,
        },
      ]}
      onPress={async () => {
        const success = await transferToken(
          web3,
          amount,
          connection,
          walletAddress
        );
        setWithdrawnFromSNX(success);
      }}
    >
      <View style={layout.row}>
        {image}
        <View style={{ marginLeft: 10 }}>
          <Text style={[text.h2, { fontWeight: "normal", textAlign: "left" }]}>
            {name}
          </Text>
          <Text style={[text.p, { textAlign: "left" }]}>{subName}</Text>
        </View>
      </View>
      {transfered ? (
        <FontAwesome
          name="check-circle"
          color={getColor("green", 1)}
          size={70}
        />
      ) : (
        <View style={layout.row}>
          <Text style={text.h1}>{formatTokenAmount(amount)}</Text>
          <FontAwesome name="chevron-right" color={getColor("black", 1)} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function TransferFunds({ step }: { step: number }) {
  const connection = useWalletConnect();
  const { web3 } = useWeb3Connection();
  const [balances, setBalances] = React.useState<{
    tokens: TokenAmount[];
    mobiusFarms?: [Farm, TokenAmount][];
    ubeFarms?: [Farm, TokenAmount][];
  }>();
  const tokens = useDefaultTokens();

  React.useEffect(() => {
    if (connection.connected && connection.accounts[0]) {
      (async () => {
        setBalances(
          await fetchAllBalances(web3, connection.accounts[0], tokens)
        );
      })();
    }
  }, [connection.connected]);

  const tokensToTransfer = React.useMemo(
    () =>
      balances?.tokens.map((amount) => ({
        image: <CurrencyLogo currency={amount.currency} size={70} />,
        name: amount.currency.name,
        subName: amount.currency.symbol,
        amount,
      })),
    [balances]
  );
  const gaugesToTransfer = React.useMemo(
    () =>
      balances?.mobiusFarms.map(([farm, amount]) => {
        return {
          image: (
            <MultiTokenLogo
              tokens={farm.underlyingTokens.map((addr) => tokens[addr])}
            />
          ),
          name: "Mobius Gauge",
          subName: "MOB-LP",
          amount: amount,
        };
      }),
    [balances]
  );

  const RenderItem = ({
    item,
  }: {
    item: {
      image: JSX.Element;
      name: string;
      subName: string;
      amount: TokenAmount;
    };
  }) => <TokenMigrationRow {...item} />;

  return (
    <StepContainer
      step={2}
      currentStep={step}
      title="Approve token transfers"
      completedText=""
    >
      {balances ? (
        <FlatList
          data={tokensToTransfer.concat(gaugesToTransfer)}
          renderItem={RenderItem}
          ItemSeparatorComponent={() => <View style={{ padding: 10 }} />}
          keyExtractor={(data) => `migration-row-${data.name}`}
          style={{ overflow: "visible" }}
        />
      ) : null}
    </StepContainer>
  );
}