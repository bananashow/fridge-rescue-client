import { styled } from 'styled-components';
import { MdClose } from 'react-icons/md';

interface Ingredient {
  id?: number;
  name: string;
  amount: string;
}

interface AddedIngredient {
  addItemList: Ingredient[] | undefined;
  setAddItemList: (name: string, amount: string) => void;
  deleteItem: (name: string) => void;
}

export const UsedIngrident = ({ addItemList, setAddItemList, deleteItem }: AddedIngredient) => {
  return (
    <AddIngrident>
      {addItemList?.map((e, i) => (
        <Ingridient key={i}>
          <div>
            <span>{e.name}</span>
            <MdClose onClick={() => deleteItem(e.name)} />
          </div>
          <input
            value={e.amount}
            type="text"
            placeholder="재료 양"
            onChange={(event) => setAddItemList(e.name, event.target.value)}
          ></input>
        </Ingridient>
      ))}
    </AddIngrident>
  );
};

const AddIngrident = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  place-items: center;
  gap: 10px;
  margin-top: 15px;
`;

const Ingridient = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.darkGray};
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.grayishWhite};

  div > svg {
    position: absolute;
    top: 3px;
    right: 5px;
    cursor: pointer;
  }

  div > span {
    font-weight: 600;
  }

  input {
    border-radius: 5px;
    outline: none;
    width: 70px;
    height: 30px;
    margin-top: 10px;
    outline: none;
    border: 1px solid ${(props) => props.theme.colors.gray};
    text-align: center;
  }
`;
