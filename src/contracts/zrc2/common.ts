export const definition = `scilla_version 0`;

export const library = (operator: boolean) => `
import ${operator ? "BoolUtils ListUtils ": ""}IntUtils
library FungibleToken
`;

export const msg = `
let one_msg = 
  fun (msg : Message) => 
  let nil_msg = Nil {Message} in
  Cons {Message} msg nil_msg

let two_msgs =
fun (msg1 : Message) =>
fun (msg2 : Message) =>
  let msgs_tmp = one_msg msg2 in
  Cons {Message} msg1 msgs_tmp
`;

export const error = `
(* Error events *)
type Error =
| CodeIsSender
| CodeInsufficientFunds
| CodeInsufficientAllowance
| CodeNotOwner
| CodeNotApprovedOperator

let make_error =
  fun (result : Error) =>
    let result_code = 
      match result with
      | CodeIsSender              => Int32 -1
      | CodeInsufficientFunds     => Int32 -2
      | CodeInsufficientAllowance => Int32 -3
      | CodeNotOwner              => Int32 -4
      | CodeNotApprovedOperator   => Int32 -5
      end
    in
    { _exception : "Error"; code : result_code }
`;

export default (operator: boolean = false) => `
${definition}

${library(operator)}

${msg}

${error}
`;
