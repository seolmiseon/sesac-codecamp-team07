import { gql } from '@apollo/client';

export const FETCH_BOARD = gql`
    query fetchBoard($boardId: ID!) {
        fetchBoard(boardId: $boardId) {
            _id
            writer
            title
            contents
            youtubeUrl
            createdAt
            boardAddress {
                _id
                address
                zipcode
                addressDetail
            }
        }
    }
`;
