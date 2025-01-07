import { useState, useEffect } from 'react';
import { getUsers } from '../api/endpoints/users';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { SearchBarCustom } from '../components/mui_custom';
import { User } from '../api/types/apiTypes';
import { AxiosError } from 'axios';

function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <SearchBarCustom />
      <Box component="div">
        <Typography variant="h6" fontWeight={700}>
          Différentes façons de visiter l'Isère
        </Typography>
        <Typography variant="body1" component="span">
          Nos sites les plus visités
        </Typography>
      </Box>

      {/* Affichage du chargement, erreur ou utilisateurs */}
      {loading && <Typography>Chargement des utilisateurs...</Typography>}
      {error && <Typography color="error">Erreur : {error.message}</Typography>}
      
      {/* Affichage des utilisateurs */}
      {!loading && !error && (
        <Box component="div" mt={2}>
          {users.length === 0 ? (
            <Typography>Aucun utilisateur trouvé.</Typography>
          ) : (
            users.map((user) => (
              <Card key={user.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2">{user.email}</Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* <CardSPR /> */}
    </>
  );
}

export default Home;
