/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profileIdentity.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: lumugot <lumugot@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/04/29 09:56:26 by lumugot           #+#    #+#             */
/*   Updated: 2026/04/29 11:49:31 by lumugot          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const devAvatars: Record<string, string> = {
  lumugot: '/avatarsdevs/lumugot.png',
  acholias: '/avatarsdevs/Acholias.png',
  agtdbx: '/avatarsdevs/agtdbx.png',
  aderouba: '/avatarsdevs/aderouba.png',
}

export function normalizePlayerName(value: string) {
  return value.trim().toLowerCase()
}

export function isDevPlayerName(value: string) {
  return normalizePlayerName(value) in devAvatars
}

export function getDevAvatar(value: string) {
  return devAvatars[normalizePlayerName(value)] ?? null
}

export function resolveAvatarForPlayer(value: string, fallbackAvatar: string | null) {
  return getDevAvatar(value) ?? fallbackAvatar
}