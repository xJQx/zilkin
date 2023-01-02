const definition = `
(* SPDX-License-Identifier: MIT *)
scilla_version 0
`;

const library = `
(***************************************************)
(*               Associated library                *)
(***************************************************)
import BoolUtils ListUtils IntUtils
library NonfungibleToken

type Operation =
| Add
| Sub
`;

const globals = `
(* Global variables *)
let zero_address = 0x0000000000000000000000000000000000000000
let false = False
let true = True
let zero = Uint256 0
let one = Uint256 1
let empty_string = ""

let add_operation = Add
let sub_operation = Sub
let min_fee_bps = Uint128 1
let max_fee_bps = Uint128 10000
`;
const libraryFunctions = `
(* Library functions *)
let one_msg = 
  fun (msg: Message) => 
    let nil_msg = Nil {Message} in
    Cons {Message} msg nil_msg

let two_msgs =
  fun (msg1: Message) =>
  fun (msg2: Message) =>
    let msgs_tmp = one_msg msg2 in
    Cons {Message} msg1 msgs_tmp

let get_bal =
  fun (maybe_bal: Option Uint256) =>
    match maybe_bal with
    | None => zero
    | Some bal => bal
    end
`;

export const error = `
(* Error exception *)
type Error =
  | NotPausedError
  | PausedError
  | SelfError
  | NotContractOwnerError
  | NotContractOwnershipRecipientError
  | NotTokenOwnerError
  | NotMinterError
  | NotOwnerOrOperatorError
  | MinterNotFoundError
  | MinterFoundError
  | SpenderFoundError
  | OperatorNotFoundError
  | OperatorFoundError
  | NotAllowedToTransferError
  | TokenNotFoundError
  | InvalidFeeBPSError
  | ZeroAddressDestinationError
  | ThisAddressDestinationError

let make_error =
  fun (result: Error) =>
    let result_code = 
      match result with
      | NotPausedError                     => Int32 -1
      | PausedError                        => Int32 -2
      | SelfError                          => Int32 -3
      | NotContractOwnerError              => Int32 -4
      | NotTokenOwnerError                 => Int32 -5
      | NotMinterError                     => Int32 -6
      | NotOwnerOrOperatorError            => Int32 -7
      | MinterNotFoundError                => Int32 -8
      | MinterFoundError                   => Int32 -9
      | SpenderFoundError                  => Int32 -10
      | OperatorNotFoundError              => Int32 -11
      | OperatorFoundError                 => Int32 -12
      | NotAllowedToTransferError          => Int32 -13
      | TokenNotFoundError                 => Int32 -14
      | InvalidFeeBPSError                 => Int32 -15
      | ZeroAddressDestinationError        => Int32 -16
      | ThisAddressDestinationError        => Int32 -17
      | NotContractOwnershipRecipientError => Int32 -18
      end
    in
    { _exception: "Error"; code: result_code }

`;

export default `
${definition}

${library}

${globals}

${libraryFunctions}

${error}
`;
