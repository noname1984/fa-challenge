import {
  useCallback,
  useContext,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router";
import AppContext from "../../contexts/AppContext";

export default function GetToken() {
  const context = useContext(AppContext);

  const [curToken, setCurToken] = useState("");
  const navigate = useNavigate();

  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const val = event.target.value;
      setCurToken(val);
    },
    [],
  );

  const onSubmitHandler = useCallback(() => {
    context?.setToken(curToken);
    navigate("/playground");
  }, [context, curToken, navigate]);

  const onKeyDownHandler = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSubmitHandler();
      }
    },
    [onSubmitHandler],
  );

  return (
    <section className="flex flex-col w-[300px] m-auto gap-[10px]">
      <label htmlFor="token" className="text-center">
        Please enter your token
      </label>
      <input
        id="token"
        name="token"
        value={curToken}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        className="border-1 rounded-[5px] border-gray-600 p-[5px]"
      ></input>
      <button
        className="border-1 rounded-[5px] border-gray-500"
        onClick={() => onSubmitHandler()}
      >
        Send
      </button>
    </section>
  );
}
