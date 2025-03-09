import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from './user';
import type { Playlist } from '@/types/playlist';
import { getUserPlaylists, createPlaylist, deletePlaylist } from '@/api/playlist';

export const usePlaylistStore = defineStore('playlist', () => {
  const userStore = useUserStore();

  // 状态
  const playlists = ref<Playlist[]>([]);

  // 计算属性
  const userPlaylists = computed(() => {
    return playlists.value.filter(
      (playlist) => playlist.userId === userStore.profile?.userId
    );
  });

  const likedPlaylists = computed(() => {
    return playlists.value.filter(
      (playlist) => playlist.userId !== userStore.profile?.userId
    );
  });

  // 获取用户歌单
  const getUserPlaylistsAction = async () => {
    try {
      if (!userStore.profile?.userId) return;
      const { playlist } = await getUserPlaylists(userStore.profile.userId);
      playlists.value = playlist;
    } catch (error) {
      console.error('获取用户歌单失败:', error);
    }
  };

  // 创建歌单
  const createPlaylistAction = async (name: string, privacy = false) => {
    try {
      const res = await createPlaylist({
        name,
        privacy,
      });
      await getUserPlaylistsAction();
      return res;
    } catch (error) {
      console.error('创建歌单失败:', error);
      return null;
    }
  };

  // 删除歌单
  const deletePlaylistAction = async (id: number) => {
    try {
      await deletePlaylist(id);
      await getUserPlaylistsAction();
      return true;
    } catch (error) {
      console.error('删除歌单失败:', error);
      return false;
    }
  };

  return {
    // 状态
    playlists,
    userPlaylists,
    likedPlaylists,
    // 方法
    getUserPlaylists: getUserPlaylistsAction,
    createPlaylist: createPlaylistAction,
    deletePlaylist: deletePlaylistAction,
  };
});